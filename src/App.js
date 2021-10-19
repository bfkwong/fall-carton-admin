import { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";

Amplify.configure(awsconfig);

function App() {
  const [files, setFiles] = useState([]);

  const getAllFiles = async () => {
    const cogUserId = await Auth.currentSession();
    const resp = await fetch(`https://uvn8m8dpn6.execute-api.us-west-2.amazonaws.com/prod/v1/allfiles`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: cogUserId?.idToken?.jwtToken
      }
    });
    const respData = await resp.json();
    setFiles(respData.Items);
  };

  useEffect(() => {
    getAllFiles();
  }, []);

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>FallCreates Admin Portal</h1>
        <AmplifySignOut />
      </div>
      <table>
        <tr>
          <th>Name</th>
          <th>User</th>
          <th>Last modified</th>
          <th>Actions</th>
        </tr>
        {files.map((file) => (
          <tr>
            <td>{file.name}</td>
            <td>{file.userId}</td>
            <td>{file.lastModifiedTime}</td>
            <td>
              <button
                onClick={async () => {
                  const cogUserId = await Auth.currentSession();
                  await fetch(
                    `https://uvn8m8dpn6.execute-api.us-west-2.amazonaws.com/prod/v1/allfiles?fileid=${file.fileId}`,
                    {
                      method: "DELETE",
                      mode: "cors",
                      headers: {
                        Authorization: cogUserId?.idToken?.jwtToken
                      }
                    }
                  );
                  getAllFiles();
                }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default withAuthenticator(App);
