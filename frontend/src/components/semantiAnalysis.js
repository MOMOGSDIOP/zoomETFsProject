export const analyzeUserQuery = async (query) => {  
    const response = await fetch("/api/semantic/search", {  
        method: "POST",  
        body: JSON.stringify({ query }),  
        headers: { "Content-Type": "application/json" }  
    });  
    return response.json(); 
    // { keywords: [], filters: { fees_max: 0.5, ... } }  
};  