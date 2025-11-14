import torch
import torch.nn as nn
import torch.nn.functional as F

class ETFSemiSupervisedModel(nn.Module):
    def __init__(self, input_dim=25, dropout_rate=0.3, combined_dim=None):
        super().__init__()
        self.input_dim = input_dim
        self.combined_dim = combined_dim or input_dim

        self.base_encoder = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.LeakyReLU(),
            nn.LayerNorm(256),
            nn.Dropout(dropout_rate),
            nn.Linear(256, 128),
            nn.LeakyReLU(),
            nn.Dropout(dropout_rate)
        )

        if combined_dim and combined_dim != input_dim:
            self.combined_encoder = nn.Sequential(
                nn.Linear(combined_dim, 256),
                nn.LeakyReLU(),
                nn.LayerNorm(256),
                nn.Dropout(dropout_rate),
                nn.Linear(256, 128),
                nn.LeakyReLU(),
                nn.Dropout(dropout_rate)
            )
        else:
            self.combined_encoder = None

        self.fc_mu = nn.Linear(128, 64)
        self.fc_var = nn.Linear(128, 64)

        self.decoder = nn.Sequential(
            nn.Linear(64, 128),
            nn.LeakyReLU(),
            nn.LayerNorm(128),
            nn.Dropout(dropout_rate),
            nn.Linear(128, input_dim)
        )

        self.supervised_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.SiLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )

        self.reset_parameters()

    def reset_parameters(self):
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                if m.bias is not None:
                    nn.init.zeros_(m.bias)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def encode(self, x, use_combined=False):
        if use_combined and self.combined_encoder is not None:
            return self.combined_encoder(x)
        else:
            return self.base_encoder(x)

    def forward(self, x, supervised=True, use_combined=False):
        assert x.shape[-1] in [self.input_dim, self.combined_dim], \
            f"Dimension d'entrée inattendue: {x.shape[-1]}"

        encoded = self.encode(x, use_combined)

        if supervised:
            return self.supervised_head(encoded)
        else:
            mu = self.fc_mu(encoded)
            logvar = self.fc_var(encoded)
            z = self.reparameterize(mu, logvar)
            x_recon = self.decoder(z)
            return x_recon, mu, logvar

    def vae_loss(self, recon_x, x, mu, logvar):
        recon_loss = F.mse_loss(recon_x, x, reduction='mean')
        kl_div = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        return recon_loss + kl_div, recon_loss, kl_div

    def train_model(self, dataloader, optimizer, device='cpu', epochs=30, supervised=True, loss_fn=None):
        self.to(device)
        self.train()

        print(f"{'='*20} DÉBUT ENTRAÎNEMENT {'='*20}")
        for epoch in range(epochs):
            total_loss = 0.0
            total_recon = 0.0
            total_kl = 0.0

            for batch in dataloader:
                optimizer.zero_grad()

                if supervised:
                    X_batch, y_batch = batch
                    X_batch = X_batch.to(device).float()
                    y_batch = y_batch.to(device).float().unsqueeze(1)

                    preds = self.forward(X_batch, supervised=True)
                    loss = loss_fn(preds, y_batch)
                else:
                    X_batch = batch.to(device).float()
                    x_recon, mu, logvar = self.forward(X_batch, supervised=False)
                    loss, recon, kl = self.vae_loss(x_recon, X_batch, mu, logvar)
                    total_recon += recon.item()
                    total_kl += kl.item()

                loss.backward()
                optimizer.step()
                total_loss += loss.item()

            if supervised:
                print(f"[Epoch {epoch+1}/{epochs}] 🔹 Loss: {total_loss:.4f}")
            else:
                print(
                    f"[Epoch {epoch+1}/{epochs}] 🔸 Total: {total_loss:.4f} | "
                    f"Recon: {total_recon:.4f} | KL: {total_kl:.4f}"
                )
        print(f"{'='*22} FIN ENTRAÎNEMENT {'='*22}")

    def predict(self, X: torch.Tensor, device='cpu', batch_size=64) -> torch.Tensor:
        """
        Prédiction sur un lot de données. Retourne les scores.
        :param X: données d'entrée [N, input_dim]
        :param device: 'cpu' ou 'cuda'
        :return: prédictions [N, 1]
        """
        self.eval()
        self.to(device)

        results = []
        with torch.no_grad():
            for i in range(0, len(X), batch_size):
                batch = X[i:i+batch_size].to(device).float()
                preds = self.forward(batch, supervised=True)
                results.append(preds.cpu())

        return torch.cat(results, dim=0)
