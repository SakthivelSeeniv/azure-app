import './App.css';
function PBITable(props) {

    return (
        <div className="PBITable">
         <label>PBI Workspaces:</label>
         <table>
          <thead>
           <tr id='Row'>
            <th id='Header'>Name</th>
            <th id='Header'>Type</th>
            <th id='Header'>ID</th>
           </tr>
          </thead>
          <tbody>
           {props.data}
          </tbody>
         </table>

        </div>)
    
}
export default PBITable;