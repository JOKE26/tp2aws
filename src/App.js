import React, { useEffect, useState } from 'react';
import './App.css';
import { Amplify} from 'aws-amplify';
import { withAuthenticator,  Button, Heading  } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import awsExports from "./aws-exports"

Amplify.configure(awsExports)
const App = ({ signOut, user }) => {
  const [ressources, setRessources] = useState([]);


  return (
  <div style={styles.container}>
    <Heading level={1}>Hello {user.attributes.email}</Heading>
    <Button onClick={signOut} style={styles.button}>Sign out</Button>
    <h2>Amplify App</h2>

    {/* {JSON.stringify(user,null,2)} */}

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
