import { Request, Response } from "express";
import { DataService } from "../services/data-service";

export class DataController {
  static async fetchAll(req: Request, res: Response): Promise<Response> {
    try {
      const data = await DataService.findAll();

      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "No data found",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: null,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
        data: null,
      });
    }
  }
}
