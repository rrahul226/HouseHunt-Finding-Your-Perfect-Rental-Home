import React, { useState } from 'react';
import { Button, message, Select, Input, Form } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FinalizePayment = ({ booking, onClose }) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [loading, setLoading] = useState(false);

  // Destructure booking details
  const {
    _id: bookingId,
    renterId,
    ownerId,
    status: bookingStatus,
    amount: bookingAmount
  } = booking || {};

  const handlePayment = async (values) => {
    if (bookingStatus !== "approved") {
      return message.success("Payment Successful");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/payment/pay-to-owner",
        {
          bookingId,
          renterId,
          ownerId,
          amount: values.amount,
          paymentMethod,
          details: values.upiId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success("Payment Successful");
        form.resetFields();
        onClose?.(); // Close modal or refresh view
      } else {
        message.error("Payment Failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      message.error("Payment Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
      <p>Status: <strong>{bookingStatus}</strong></p>

      <Form form={form} onFinish={handlePayment} layout="vertical">
        <Form.Item label="Payment Method">
          <Select value={paymentMethod} onChange={setPaymentMethod}>
            <Option value="gpay">GPay</Option>
            <Option value="phonepe">PhonePe</Option>
            <Option value="paytm">Paytm</Option>
            <Option value="card">Card</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="upiId"
          label="UPI ID / Mobile Number"
          rules={[{ required: true, message: "Please enter UPI ID or phone" }]}
        >
          <Input placeholder="yourname@upi or 9876543210" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          initialValue={bookingAmount}
          rules={[{ required: true, message: "Enter the amount" }]}
        >
          <Input type="number" placeholder="Enter payment amount" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Pay
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FinalizePayment;
