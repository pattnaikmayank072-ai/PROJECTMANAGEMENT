import {Router} from "exprees";
import {healthCheck} from "../controllers/healthcheck.controllers.js";

const router=Router();


router.rout("/").get(healthCheck);



export default router;