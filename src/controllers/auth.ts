import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const client = PrismaClient();