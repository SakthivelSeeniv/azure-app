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
      //'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvY2M4ZjgxYmQtZTNkOC00MzE2LTk4YTgtOTQwOTQ1OGMwZDllLyIsImlhdCI6MTcwMjYxNTM0OSwibmJmIjoxNzAyNjE1MzQ5LCJleHAiOjE3MDI2MjA0NTQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VkFBQUFTYWppcFJPMkYzM0FQRXhEODJscTVqTWZONjlGZlRJbHVkeHZqYVRoMTM3Y2U0MDJIejJma3o3MUhxeEkwaHdPIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjYxNDQwM2M2LTIxM2UtNDE5My05ZTlhLTgxZGU1NmNlODMxMiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiVXNlciIsImdpdmVuX25hbWUiOiJEZW1vIiwiaXBhZGRyIjoiNjQuMjI3LjIxLjI1MSIsIm5hbWUiOiJEZW1vIFVzZXIiLCJvaWQiOiIyM2E0MDQ0Zi00ZjEyLTRlZGYtYTBhNS1iMzJkY2U4ZjgwODMiLCJwdWlkIjoiMTAwMzIwMDIyQkYyOTI5OSIsInJoIjoiMC5BVW9BdllHUHpOampGa09ZcUpRSlJZd05uZ2tBQUFBQUFBQUF3QUFBQUFBQUFBQktBRDguIiwic2NwIjoiQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIEl0ZW0uUmVhZC5BbGwgSXRlbS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBUZW5hbnQuUmVhZC5BbGwgVGVuYW50LlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic3ViIjoiVlJBaF9qT3A3WS14Q0pWM091bFRscmFwZE9ua1ZHNTFkZFZIQmgwZnNyWSIsInRpZCI6ImNjOGY4MWJkLWUzZDgtNDMxNi05OGE4LTk0MDk0NThjMGQ5ZSIsInVuaXF1ZV9uYW1lIjoiZGVtb0BtZXRyaWNzYmkub25taWNyb3NvZnQuY29tIiwidXBuIjoiZGVtb0BtZXRyaWNzYmkub25taWNyb3NvZnQuY29tIiwidXRpIjoiaFB6bFNkV2lvME9jbVBRXzcwUjRBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYTllYTg5OTYtMTIyZi00Yzc0LTk1MjAtOGVkY2QxOTI4MjZjIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.ioznl2Yl3KabxBFj_55AQjOfJX2tOyG5jETpxpPxoaCLyPc0Nv3HqiXuGkrE9xH_osUtbdhvl8MOubIm-G4fdZi1pR4b3QHJD04h48El9D0cBySFJ7L9EYmZwsVYMZ4MIZ0rNL7xVCKiecrqtU1V9lVs7nQ-YBVDWZ98TjVyBoGs03vgg8fIg1vDd2SZ2jqX2ndToZdU9NRZdgQZkG7EfgkMlVslHcV78qLawMnoXUDOKmGeAIUcROOPv0j5vMPXta3iasqTXWT927Yi-gpxVuKfVbZti0GBTr2H_CQZZPA802f_PHqb6Yf6wLZ3Xzi1d8GQ7yEtfpPSgz_uEubZvA'
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