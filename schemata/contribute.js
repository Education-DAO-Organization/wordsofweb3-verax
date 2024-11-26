// Schema definition
const schema = {
  "name": "wordsofweb3 contribution",
  "description": "Schema for contributions to wordsofweb3.eth.limo",
  "context": "https://wordsofweb3.eth.limo", // Link to the shared vocabulary or ontology
  "schemaString": "(string term, string phonetic, string partOfSpeech, string category, string definition, string comments, address submitter)"
};

// Export the schema for use in index.js
export { schema };
