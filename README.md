# Vault Demo Application

This is a demo banking application for **Vault**, a mock company.  
It simulates a simple credit application process:

1. A customer fills out an application form.
2. The app sends the information to an API (simulated or the Alloy Sandbox API).
3. The customer receives a decision message:
   - ✅ Approved  
   - 🔵 Manual Review  
   - ❌ Denied  

---

## Frontend (User Interface)

- **React**: builds the interactive form and UI components  
- **Vite**: development and build tool for fast setup and packaging  
- **React Hook Form + Zod**: manage form inputs and validate data before submission  
- **Modal**: popup messages to show application outcomes

---

## Backend (Server)

- **Express**: lightweight server that receives form data  
- **Axios**: sends requests from the server to the Alloy API  
- **Zod**: validates incoming data on the server  
- **dotenv**: securely manages environment variables (like API keys)  
- **Morgan**: logs requests for debugging and monitoring  

---

## Purpose

This project demonstrates a simple end-to-end web app flow:
- A **frontend** that collects and validates customer data.  
- A **backend** that checks the data and communicates with an external decision API.  
- Clear user feedback with success, manual review, or denial messages.
