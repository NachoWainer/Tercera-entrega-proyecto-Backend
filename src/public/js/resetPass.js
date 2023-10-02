
const form= document.getElementById("recoverPassForm")

form.addEventListener("submit", async e =>{
    e.preventDefault()
    const data = new FormData(form)
    const obj={}
    data.forEach((value,key)=>obj[key] = value)

    try {
        fetch(`/reset-pass?token=${token}&user=${user}`,{
          method:"POST",
          body:JSON.stringify(obj),
          headers:{
              "Content-type":"application/json"
          }
      })
      .then(result =>{
          if(result.status === 200){
              window.location.replace('/')}
          })
      }    
        
       catch(error){
        req.logger.error(error)
      }
    }); 