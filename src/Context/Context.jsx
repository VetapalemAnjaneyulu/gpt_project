import { createContext, useState } from "react";
import run from "../Config/Gpt"
export const Context = createContext();

const ContextProvider = (props) => {

    const [ input,setInput ] = useState("");
    const [ recentprompt,setRecentprompt ] = useState("");
    const [ prevPrompts,setprevPrompts ] = useState([]);
    const [ showResult,setshowResult ] = useState(false);
    const [ loading,setLoading ] = useState(false);
    const [ resultData,setresultData] = useState("");
    

    const delayPara = ( index,nextWord ) => {
        setTimeout(function () {
            setresultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () =>{
        setLoading(false);
        setshowResult(false)
    }

    const onSent = async (prompt) => {

        setresultData("");
        setLoading(true);
        setshowResult(true);
        let response;
        if (prompt !== undefined){
            response = await run(prompt);
            setRecentprompt(prompt)
        }
        else
        {
            setprevPrompts(prev=>[...prev,input]);
            setRecentprompt(input);
            response = await run(input);
        }
        let responseArray = response.split("**");
        let newResponse = "";
        for(let i=0 ; i < responseArray.length;i++)
        {
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i]
            }
            else{
                newResponse +="<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponsearray = newResponse2.split(" ");
        for(let i=0;i<newResponsearray.length;i++){
            const nextWord = newResponsearray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false);
        setInput("")
    }


    const contextValue = {
        prevPrompts,
        setprevPrompts,
        onSent,
        setRecentprompt,
        recentprompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider