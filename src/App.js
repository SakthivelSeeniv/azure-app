import './App.css';
import PBITable from './PBITable';
import APITable from './APITable';
import { authProvider } from './authConfig';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { useState} from "react";
import {ThreeDots } from 'react-loader-spinner';
const JS = require('js-base64');
function App() {
  const [Authenticated,setAuthenticated] = useState(false);
  const [PBIWorkspacesTableData,setPBIWorkspacesTableData] = useState();
  const [APITableData,setAPITableData] = useState();
  const [loader,setLoader] = useState(false);
  const [RequestOption,setRequestOption]=useState();
  const GetGroups = async () => {

    const options1 = {
        method: 'GET'
       };
       const url1 = `https://funpbi.azurewebsites.net/api/HttpTrigger1?code=qmdCe1mbYDxmEj7b430R8HCarOuMpBzlh8GmAP7tBi-DAzFuJRaYwA==`
       const response1 = await fetch(url1, options1)
       const AT=(await response1.text()).toString();

       const bearer = `Bearer ${AT}`;
    const options = {
     headers: {
      'Authorization': bearer
     }};
    const url = `https://api.powerbi.com/v1.0/myorg/groups`
    const url2 ='https://api.fabric.microsoft.com/v1/workspaces/50fb1659-28e3-481a-81ed-2b953a5b4103/items/347af260-b5e4-4ad2-be1d-bb5250fb39fc/getDefinition'
    const response = await fetch(url, options)
    const result = await response.json();
    console.log("Result",result)
    const PBIWorkspaces=[]
    for (const i of result.value){
      PBIWorkspaces.push(
      <tr id='Row'>
        <td id='Data'>{i.name}</td>
        <td id='Data'>{i.type}</td>
        <td id='Data'>{i.id}</td>
      </tr>)
    }
    setPBIWorkspacesTableData(PBIWorkspaces);

    const options2 = {
      method: 'POST',
      headers: {
        'Authorization': bearer
      }
    };
    setRequestOption(bearer);
    const response2 = await fetch(url2, options2)
    const result2 = await response2.json();
    console.log("Result",result2)
    let decodedString = JS.decode(result2.definition.parts[0].payload);
    let decodedJson=JSON.parse(decodedString).model.tables;
    setAPITableData(decodedJson);
       
   }
  function AuthPage(){
    if (Authenticated===false){
      setAuthenticated(true);
    }
    else{
      setAuthenticated(false);
      setPBIWorkspacesTableData(null);
      setAPITableData(null);
    }
  }
  return (
    <div className="App">
      {!Authenticated&&<button id='LoginButton' onClick={AuthPage}>Login</button>}
 
    {Authenticated&&!PBIWorkspacesTableData&&!APITableData&&<AzureAD provider={authProvider} forceLogin={true}>
  {
    ({login, logout, authenticationState, error, accountInfo}) => {
      setLoader(true);
      GetGroups();
    }
  }
</AzureAD>}
{Authenticated&&PBIWorkspacesTableData&&APITableData&&<AzureAD provider={authProvider}>
  {
    ({login, logout, authenticationState, error, accountInfo}) => {
      setLoader(false);
      switch (authenticationState) {
        case AuthenticationState.Authenticated:
          return (
      <div>
        <div id='Heading'>
          <span>Welcome, {accountInfo.account.userName}</span>
          <button id='LogoutButton' onClick={()=>{logout();AuthPage();}}>Logout</button>
        </div>
        <div id='Page'>
          <PBITable data={PBIWorkspacesTableData}></PBITable>
          <APITable data={APITableData} option={RequestOption}></APITable>
        </div>
      </div>
            
          );
        case AuthenticationState.Unauthenticated:
          return (
            <div>
              {error && <p><span>An error occured during authentication, please try again!</span></p>}
              <p>
                <span>Hey stranger, you look new!</span>
                <button onClick={login}>Login</button>
              </p>
            </div>
          );
        case AuthenticationState.InProgress:
          return (<div>{loader&&<div id='Loader'><ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
           /></div>}</div>);
      }
    }
  }
</AzureAD>}
{loader&&<div id='Loader'><ThreeDots
height="80"
width="80"
radius="9"
color="#4fa94d"
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClass=""
visible={true}
 /></div>}
    </div>
  );
}
export default App;