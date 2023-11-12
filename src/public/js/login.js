
const form= document.getElementById("loginForm")

form.addEventListener("submit", e =>{
    e.preventDefault()
    const data = new FormData(form)
    const obj={}
    data.forEach((value,key)=>obj[key] = value)
    console.log("HOLA")

    fetch("/api/sessions/login",{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-type":"application/json"
        }
    })
    .then(result => {
        console.log(result)
        
        if(result.status === 200){
            window.location.replace('/products')
        }
        else{
            window.location.replace('/')

        }

    })
})