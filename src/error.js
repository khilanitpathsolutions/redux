import React from 'react'
import { Link } from 'react-router-dom'
import errorImg from '../src/assets/13.png'
import { Button, Card } from 'react-bootstrap'

const ErrorPage = () => {
  return (
    <>
    <h4>Page Not Found...</h4>
    <Card>
    <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Card.Img
              src={errorImg}
              alt='error'
              style={{
                width: "100%",
                maxHeight: "900px",
                maxWidth: "900px",
                height: "100%",
              }}
            />
            </div>
    <div style={{width:"100%",display:"flex",justifyContent:"center"}}>
    <Link to='/' style={{textDecoration: "none"}}><Button variant='warning' style={{width:"200px",justifyContent: "center"}}>Home</Button></Link>
    </div><br></br>
    </Card>
    </>
  )
}

export default ErrorPage