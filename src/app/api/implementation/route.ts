import {
  UserNotFoundException,
  UserService,
} from "@/lib/services/user-service";

export async function GET(request: Request) {
  try {
    const user = await UserService.Instance.getUser();
    return user;
  } catch (e) {
    if (e instanceof UserNotFoundException) {
      return { msg: e.message };
    }
    throw e;
  }
}
