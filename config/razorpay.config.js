import Razorypay from "razorpay";
import config from "./index";

const razorpay = new Razorypay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_SECRET,
});
