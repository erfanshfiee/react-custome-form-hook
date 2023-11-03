import React from 'react';
import './App.css';
import useForm from './hooks/use-form'
import {object, string} from 'yup';
const formSchema=object().shape(
    {
        name:string().email().required(),
        language:string().required(),
    }
)
function App() {
    const {register,handleSubmit,errors,onChange} = useForm<formValues>(formSchema,)
    const onSubmit=(formValues:formValues)=>{
        console.log(formValues)
        console.log(errors)
    }
    onChange("name",(nameVal)=>{
        console.log(nameVal)
    })
    const getError=(name:string)=>{
        if(errors){
            const allErrors=errors[name]
            if(allErrors){
                return(
                    <div>
                        {
                            allErrors.map(e=><p key={e}>{e}</p>)
                        }
                    </div>
                )
            }
        }
    }
    return (
        <div className="App">
            <form onSubmit={e=>handleSubmit(onSubmit,e)}>
                <input type="text" {...register('name')}/>
                {getError('name')}
                <br/>
                <input type="radio"  {...register('language')} value="javascript"/>
                <br/>
                <input type="radio" {...register('language')} value="c#"/>
                <br/>
                {getError('language')}

                <br/>
                <input type="checkbox" {...register('news')} value='subscribe'/>
                <br/>
                <select  {...register('car')}>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
                <button type='submit'>submit</button>
            </form>
        </div>
    );
}
interface formValues{
    name:string;
    radio?:string;
}
export default App;
