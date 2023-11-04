import { useCallback, useEffect } from "react";
import "./App.css";
import useForm from "./hooks/use-form";
import { object, string } from "yup";
const formSchema = object().shape({
  email: string().email().required(),
});
function App() {
  const { register, handleSubmit, errors, onChange } = useForm<formValues>({
    validationScheme: formSchema,
    initialValues: { email: "15" },
  });
  const onSubmit = (formValues: formValues) => {
    console.log(formValues);
    console.log(errors);
  };

  const handleNameChanges = useCallback(() => {
    return onChange("email", (nameVal) => {
      console.log(nameVal);
    });
  }, [onChange]);

  useEffect(() => {
    handleNameChanges();
  }, [handleNameChanges]);

  const getError = (name: string) => {
    if (errors) {
      const allErrors = errors[name];
      if (allErrors) {
        return (
          <div>
            {allErrors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        );
      }
    }
  };
  return (
    <div className="App">
      <form onSubmit={(e) => handleSubmit(onSubmit, e)}>
        <input type="text" {...register("email")} />
        {getError("email")}
        <br />
        <label>
          javascript
          <input type="radio" {...register("language")} value="javascript" />
        </label>
        <br />
        <label>
          c#
          <input type="radio" {...register("language")} value="c#" />
        </label>
        <br />
        {getError("language")}

        <br />
        <label>
          subscribe news
          <input type="checkbox" {...register("news")} value="subscribe" />
        </label>
        <br />
        <select {...register("car")}>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
interface formValues {
  email: string;
  language?: string;
  car?: string;
}
export default App;
