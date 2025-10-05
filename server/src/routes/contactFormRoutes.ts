import { Router } from "express";
import { handleContactForm } from "../controllers/contactFormController";

const router = Router();

router.post("/", handleContactForm);

export default router;
