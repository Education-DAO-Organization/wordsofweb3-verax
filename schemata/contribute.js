// Schema definition
const schema = {
    name: "Words of Web3 Contribution",
    description: "Schema for contributions to wordsofweb3.eth.limo",
    context: "https://wordsofweb3.eth.limo",  // Context for the schema's fields (ontology or custom context)
    schemaString: "(string term, string phonetic, string partOfSpeech, string category, string definition, string comments, address submitter)" // Solidity-like schema string
  };
  
  // Export the schema for use in index.js
  export { schema };