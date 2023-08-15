import React, { useEffect, useState } from 'react';
import './App.css';
import { Amplify, API, Storage } from 'aws-amplify';
import { withAuthenticator,  Button, Heading  } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import awsExports from "./aws-exports"

Amplify.configure(awsExports)
const App = ({ signOut, user }) => {
  const [ressources, setRessources] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [place, setPlace] = useState('');
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0); 

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };
  
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  
  const handleRateChange = (event) => {
    setRate(Number(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const response = await API.post('apia92058a4', '/items', {
        body: {
          place,
          comment,
          rate
        }
      });
  
      console.log('Data sent:', response);
  
      // Clear the form fields after successful submission
      setPlace('');
      setComment('');
      setRate(0);
      
      // Fetch updated API data to display on the page
      fetchApiData();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  function add_to_storage(e) {
    const file = e.target.files[0];
    console.log("Uploading file:", file.name);

    const folderPath = `${user.username}/`; // Create a folder path using the authenticated user's username

    Storage.put(folderPath + file.name, file, {
      level: 'private', // Upload the file to a private folder specific to the user
    })
      .then(result => {
        console.log("File uploaded successfully:", result);
        listUserFiles(); // Fetch the updated list of user files after the file is uploaded
      })
      .catch(err => console.log("Error uploading file:", err));
  }

  const fetchApiData = async () => {
    try {
      const response = await API.get('apia92058a4', '/items');
      console.log('response AAAA A', response);
      setRessources(response);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  async function listUserFiles() {
    try {
      const folderPath = `${user.username}/`; // Create the folder path using the authenticated user's username
      const files = await Storage.list('', {level : 'private'});
      console.log('----------------------->',folderPath, files)

      // Check if 'files' is an array, otherwise set 'userFiles' to an empty array
      const userFilesList = files.results
      console.log('user files',files)

      setUserFiles(userFilesList);
    } catch (error) {
      console.log("Error listing user files:", error);
    }
  }

  useEffect(() => {
    fetchApiData(setRessources);

    if (user && user.attributes && user.attributes.sub) {
      listUserFiles();
    }
  }, [user]);

  return (
  <div style={styles.container}>
    <Heading level={1}>Hello {user.attributes.email}</Heading>
    <Button onClick={signOut} style={styles.button}>Sign out</Button>
    <h2>Amplify App</h2>

    {/* {JSON.stringify(user,null,2)} */}

    <button onClick={fetchApiData} style={styles.button} >Charger les données de l'API</button>
    
    <h2>Photo de voyage :</h2>
    <label>
      <input type="file" onChange={add_to_storage} />
      {ressources.name ? `File selected: ${ressources.name}` : ""}
    </label>
    <h2>Liste des photos :</h2>
      {userFiles.length === 0 ? (
        <p>No files found in the user's private folder.</p>
    ) : (
    <ul>
      {userFiles.map((file, index) => (
      <li key={index}>{file.key}</li>
      ))}
    </ul>
    )}

  <form onSubmit={handleSubmit}>
    <h2>Ajouter un lieu de voyage :</h2>
    <div>
      <label>Lieu visité :</label>
      <input type="text" value={place} onChange={handlePlaceChange} style={styles.input} />
    </div>
    <div>
      <label>Commentaire :</label>
      <textarea value={comment} onChange={handleCommentChange}></textarea>
    </div>
    <div>
      <label>Note :</label>
      <input type="number" min="0" max="5" value={rate} onChange={handleRateChange} style={styles.input} />
    </div>
    <button type="submit" style={styles.button}>Envoyer</button>
  </form>

  </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: { marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);
