'use client';

import './signup-styles.css';
import React from 'react';
import { SignUp as SignupClerk} from "@clerk/nextjs";


// New pipelines as of 10/6
export default function Signup() {
  return ( 
    <div className="centered-div">
      <SignupClerk />
    </div>
  );
}