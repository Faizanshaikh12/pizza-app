import axios from "axios"
import Noty from "noty"
import {initAdmin} from "./admin"
import moment from "moment";

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false
        }).show()
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false
        }).show()
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

//Remove alert message after 2 seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

//Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            if (status.nextElementSibling) {
                stepCompleted = false
                time.innerText = moment(order.updatedAt).format('hh:mm A')
                status.appendChild(time)
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order);

//Ajax Call
const paymentForm = document.querySelector('#paymentForm')
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let formData = new FormData(paymentForm)
        let formObject = {}
        for (let [key, value] of formData.entries()) {
            formObject[key] = value
        }
        axios.post('/orders', formObject).then((res) => {
            new Noty({
                type: 'success',
                timeout: 1000,
                text: res.data.message,
                progressBar: false
            }).show()

            setTimeout(() => {
                window.location.href = '/customer/orders'
            }, 1000)

        }).catch((err) => {
            console.log(err)
        })
    })
}

//Socket
let socket = io()
//Join
if (order) {
    socket.emit('join', `order_${order._id}`)
}

let adminPath = window.location.pathname
if (adminPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order Updated',
        progressBar: false
    }).show()
})
