import React from 'react'

function loadScript(src){
 return new Promise((resolve)=>{
   const script = document.createElement("script")
   script.src = src;
   script.onload = ()=>{
    resolve(true)
   }
   
   script.onerror= ()=>{
    resolve(false)
   };
   document.body.appendChild(script)

 })
}

function Payment() {
  async function showRazorpay(){
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
      );
  
      if(!res){
        alert("Razorpay SDK failed to load. Are you Online!");
        return;
      }

      const data = await fetch("http://localhost:4455/api/razorpay", {
        method : "POST",
      }).then((t)=>t.json());

      console.log(data)

      const options = {
        key : "rzp_test_4W26iQHpqmXmZ",
        currency : data.currency,
        amount : data.amount,
        order_id : data.id,
        name : "Course Fee",
        description : "Thank you for nothing. please give us some money",
        handler : function (response){
          alert("transaction successfull")
        },
        prefill: {
          name : "ainwik",
          email : "abc1223@.in",
          phone_number : "1121221"
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open()

      
      // try {
      //   const response = await fetch("http://localhost:4455/api/razorpay", {
      //     method: "POST",
      //   });
  
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
  
      //   const data = await response.json();
      //   console.log(data);
  
      //   const options = {
      //     key: "rzp_test_4W26iQHpqmXmZ",
      //     currency: data.currency,
      //     amount: data.amount,
      //     order_id: data.id,
      //     name: "Course Fee",
      //     description: "Thank you for nothing. please give us some money",
      //     handler: function (response) {
      //       alert("transaction successful");
      //     },
      //     prefill: {
      //       name: "ainwik",
      //       email: "abc1223@.in",
      //       phone_number: "1121221"
      //     },
      //   };
      //   const paymentObject = new window.Razorpay(options);
      //   paymentObject.open();
      // } catch (error) {
      //   console.error("Error:", error);
      //   alert("Failed to initiate payment. Please try again.");
      // }


  }
  return (
    <div>
        <h1>Tshirt</h1>
        <button onClick={showRazorpay}>Pay</button>
    </div>
  )
}

export default Payment