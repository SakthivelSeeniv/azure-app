import './App.css';
import { useState,useEffect} from "react";
function APITable(props) {
    const [tableData,settableData] = useState([]);
    const [CheckedItems,setCheckedItems] = useState([]);
    const [Triggered,setTriggered]=useState(false);
    const [ isAlertVisible, setIsAlertVisible ] = useState(false);
    const [alertMessage,setalertMessage]=useState();
    const url = `https://api.powerbi.com/v1.0/myorg/groups//50fb1659-28e3-481a-81ed-2b953a5b4103/datasets/347af260-b5e4-4ad2-be1d-bb5250fb39fc/refreshes`
    async function TriggerAPI(){
        const objects=[];
        for (const i of CheckedItems){
            objects.push({
                "table":i
            })
        }
        const body={
            "type": "full",
            "commitMode": "transactional",
            "objects": objects,
            "applyRefreshPolicy": "false"
          }
          console.log("Body",body);
          const options = {
            method: 'POST',
            headers: {
              'Authorization': props.option,
              'Content-Type':'application/json'
            },
            body:body
          };
        const response = await fetch(url, options)
        console.log("Response",response);
        if(response.status==202){
            setalertMessage('API Triggered Successfuly!');
        }
        else{
            setalertMessage('Error, While Triggering API.');
        }
        setIsAlertVisible(true);
        AddingCheckBox('');
        if(Triggered){
            setTriggered(false);
        }
        else{
            setTriggered(true);
        }
    }
    function AddingCheckBox(n){
       const TableData=[];
       let checked=[]
       if(n!=''){
        checked=CheckedItems;
       }
       console.log("Before_Checked",checked,n);
       for (const i of props.data){
        const cols=[]
        for(const c of i.columns){
          cols.push(c.name)
        }
        if(i.name===n){
            if (CheckedItems.includes(n)){
                TableData.push(
                    <tr id='Row'>
                      <td id='CheckBox1'><input id='Box' type="checkbox" checked={false} onClick={()=>{AddingCheckBox(i.name);}} /></td>
                      <td id='Data1'>{i.name}</td>
                      <td id='Data1'>{i.description}</td>
                      <td id='Data1'>{i.lineageTag}</td>
                    </tr>);
                let inx=checked.indexOf(n);
                checked.splice(inx,1);
            }
            else{
                TableData.push(
                    <tr id='Row'>
                      <td id='CheckBox1'><input id='Box' type="checkbox" checked={true} onClick={()=>{AddingCheckBox(i.name);}} /></td>
                      <td id='Data1'>{i.name}</td>
                      <td id='Data1'>{i.description}</td>
                      <td id='Data1'>{i.lineageTag}</td>
                    </tr>);
                checked.push(i.name);
            }

        }
        else if(CheckedItems.includes(i.name)){
            TableData.push(
                <tr id='Row'>
                  <td id='CheckBox1'><input id='Box' type="checkbox" checked={true} onClick={()=>{AddingCheckBox(i.name);}} /></td>
                  <td id='Data1'>{i.name}</td>
                  <td id='Data1'>{i.description}</td>
                  <td id='Data1'>{i.lineageTag}</td>
                </tr>);
        }
        else{
            TableData.push(
                <tr id='Row'>
                  <td id='CheckBox1'><input id='Box' type="checkbox" checked={false} onClick={()=>{AddingCheckBox(i.name);}} /></td>
                  <td id='Data1'>{i.name}</td>
                  <td id='Data1'>{i.description}</td>
                  <td id='Data1'>{i.lineageTag}</td>
                </tr>)
        }
        
       }
       setCheckedItems(checked);
       settableData(TableData); 
    }
    useEffect(() => {
        const TableData=[]
       for (const i of props.data){
        const cols=[]
        for(const c of i.columns){
          cols.push(c.name)
        }
        TableData.push(
        <tr id='Row'>
          <td id='CheckBox1'><input id='Box' type="checkbox" checked={false} onClick={()=>{AddingCheckBox(i.name);}} /></td>
          <td id='Data1'>{i.name}</td>
          <td id='Data1'>{i.description}</td>
          <td id='Data1'>{i.lineageTag}</td>
        </tr>)
       }
       settableData(TableData);
      }, []);
      useEffect(() => {
        const TableData=[]
       for (const i of props.data){
        const cols=[]
        for(const c of i.columns){
          cols.push(c.name)
        }
        TableData.push(
        <tr id='Row'>
          <td id='CheckBox1'><input id='Box' type="checkbox" checked={false} onClick={()=>{AddingCheckBox(i.name);}} /></td>
          <td id='Data1'>{i.name}</td>
          <td id='Data1'>{i.description}</td>
          <td id='Data1'>{i.lineageTag}</td>
        </tr>)
       }
       console.log("Triggered",Triggered);
       setCheckedItems([]);
       settableData(TableData);
       setTimeout(() => {
                    setIsAlertVisible(false);
                }, 3000);
      }, [Triggered]);

    return (
        <div className="APITable">
         {isAlertVisible && <div className='alert-container'>
+               <div className='alert-inner'>{alertMessage}</div>
+           </div>}
         <label id='APILabel'>API Table:</label>
         <button id='LogoutButton' onClick={TriggerAPI}>Trigger</button>
         <table id='APITable'>
          <thead>
           <tr id='Row'>
            <th id='CheckBox'></th>
            <th id='Header1'>Name</th>
            <th id='Header1'>Description</th>
            <th id='Header1'>LineageTag</th>
           </tr>
          </thead>
          <tbody>
           {tableData}
          </tbody>
         </table>

        </div>)
    
}
export default APITable;