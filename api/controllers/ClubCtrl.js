import cloudinary from "cloudinary";
import dotenv from "dotenv";
import moment from "moment-timezone";
import { BadRequestError } from "../errors/index.js";
import { formatImage } from "../middleware/multerMiddleware.js";
const defaultDate = () => moment.tz(Date.now(), "Asia/Jakarta").valueOf();
const current_date = moment().tz("Asia/Jakarta").format();

dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const ClubController = {
  create: async function (req, res) {
    const { club_name, kota, stadium } = req.body;

    // Validation
    if (!club_name || !kota || !stadium) {
      throw new BadRequestError("Please provide all values");
    }

    let clubNameTrim = club_name.trim();

    const session = await models.ClubDB.startSession();
    session.startTransaction();

    try {
      // Validation Club Name
      const existingClubName = await models.ClubDB.findOne({
        club_name: { $regex: new RegExp(clubNameTrim, "i") },
        $or: [
          { deleted_time: { $exists: false } },
          { deleted_by: { $exists: false } },
        ],
      });

      if (existingClubName) {
        return response.error(
          400,
          `Club Name: '${clubTrim}' already exists`,
          res
        );
      }

      const club = await models.ClubDB.create({
        club_name,
        kota,
        stadium,
      });

      if (req.file) {
        try {
          const file = formatImage(req.file);
          const result = await cloudinary.uploader.upload(file, {
            folder: "CLUB",
          });

          club.img_club = result.secure_url;
          club.img_clubPublic = result.public_id;
          await user.save();
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          return response.error(
            500,
            "Error uploading image to Cloudinary",
            res
          );
        }
      }

      if (club) {
        res.status(StatusCodes.CREATED).json({
          success: true,
          message: "Create club is successfully created",
          club: {
            _id: club._id,
            club_name: club.club_name,
            clubCity: club.kota,
            club_stadium: club.stadium,
            img_club: club.img_club ? user.img_club : null,
          },
        });
      } else {
        res.status(400);
        throw new Error("Invalid Club Data");
      }
    } catch (error) {
      return response.error(400, error.message, res, error);
    } finally {
      if (session) {
        session.endSession();
      }
    }
  },
};

export default ClubController;
