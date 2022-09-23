import { Router } from "express";

import { adaptRoute } from "../adapter/express/express-route-adapter";
import { makeSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";

export default (router: Router): void => {
  router.post("/surveys", adaptRoute(makeSurveyController()));
};
