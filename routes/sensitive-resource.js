import  express  from "express";

const router = express.Router();
import { isAuthentified } from "../middleware/is-authentified";

router.get('/sensitive', isAuthentified,  sensitiveController.getData);