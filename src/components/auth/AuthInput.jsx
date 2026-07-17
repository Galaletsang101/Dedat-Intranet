function AuthInput({

  label,
  name,
  type="text",
  value,
  onChange

}) {


return (

<div className="input-group">

<label>
{label}
</label>


<input

name={name}

type={type}

value={value}

onChange={onChange}

/>


</div>

);


}


export default AuthInput;