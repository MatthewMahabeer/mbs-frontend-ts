import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJtYXR0bWFoYWJlZXJAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6Ik1hdHRoZXciLCJsYXN0X25hbWUiOiJNYWhhYmVlciIsImF1dGhlbnRpY2F0ZWQiOmZhbHNlLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2NjEyOTYxMzgsImV4cCI6MTY2MTMwMzMzOH0.j3PLhqfAwnf-kScfoFAdKqm-uzO70RnQ9m9AW39_27g"
export const baseUrl = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
});

export const baseUrlAuth = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});