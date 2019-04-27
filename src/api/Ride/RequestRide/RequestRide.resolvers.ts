import { RequestRideMutationArgs, RequestRideResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(async (
      _, 
      args: RequestRideMutationArgs, 
      { req, pubSub }
    ): Promise<RequestRideResponse> => {
      const user: User = req.user;
      if(!user.isRiding) {
        try {
          const ride = await Ride.create({ ...args, passenger: user }).save();
          pubSub.publish('rideRequest', { NearbyRideSubscription: ride });
          user.isRiding = true;
          user.save();
          return {
            ok: true,
            error: null,
            ride
          }
        } catch(error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          }
        }
      } else {
        return {
          ok: false,
          error: "You can't request two rides",
          ride: null
        }
      }
    })
  }
}

export default resolvers;