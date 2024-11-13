import { User } from "./tipos";

declare global {
    interface CustomJwtSessionClaims extends User {}
}