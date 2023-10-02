const form= document.getElementById("recoverPassForm")

form.addEventListener("submit", async e =>{
    e.preventDefault()
    const data = new FormData(form)
    const obj={}
    data.forEach((value,key)=>obj[key] = value)
    fetch(`/setRecoverpassword`,{
      method:"POST",
      body:JSON.stringify(obj),
      headers:{
          "Content-type":"application/json"
      }
  })
  .then(result =>{
      if(result.status === 200){
          window.location.replace('/')
      }

  })
    
    }); 