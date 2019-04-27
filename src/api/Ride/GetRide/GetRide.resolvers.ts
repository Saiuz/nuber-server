import { GetRideQueryArgs, GetRideResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query : {
    GetRide: privateResolver(async (
      _,
      args: GetRideQueryArgs,
      { req }
    ) : Promise<GetRideResponse> => {
      const user: User = req.user;
      try {
        const ride = await Ride.findOne({
          id: args.rideId
        });
        if(ride) {
          if(ride.passengerId === user.id || ride.driver.id === user.id) {
            return {
              ok: true,
              error: null,
              ride
            };
          } else {
            return {
              ok: false,
              error: "Not Authorized",
              ride: null
            };
          }
        } else {
          return {
            ok: false,
            error: "Ride not found",
            ride: null
          }
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          ride: null
        }
      }
    })
  }
}

export default resolvers;