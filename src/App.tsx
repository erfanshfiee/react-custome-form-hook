import React from 'react';
import './App.css';
import useForm from './hooks/use-form'
import {object, string} from 'yup';
const formSchema=object().shape(
    {
        name:string().email().required(),
        radio:string().required(),
        news:string().required()
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
    return (
        <div className="App">
            <form onSubmit={e=>handleSubmit(onSubmit,e)}>
                <input type="text" {...register('name')}/>
                <br/>
                <input type="radio"  {...register('radio')} value="HTML"/>
                <br/>
                <input type="radio" {...register('radio')} value="css"/>
                <br/>
                <input type="radio" {...register('radio')} value="22"/>
                <br/>
                <input type="checkbox" {...register('news')} value='subscribe'/>
                <br/>
                <select  {...register('select')}>
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
