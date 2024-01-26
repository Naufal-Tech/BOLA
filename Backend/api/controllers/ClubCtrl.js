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

  // Update User
  update: async function (req, res) {
    let { club_id, club_name, kota, stadium } = req.body;

    // Start a session
    const session = await models.ClubDB.startSession();
    session.startTransaction();

    try {
      const club = await models.ClubDB.findOne({
        _id: club_id,
        deleted_by: { $exists: false },
        deleted_at: { $exists: false },
      });

      if (!club) {
        return response.error(404, "Club not found", res);
      }

      let clubNameTrim = club_name ? club_name.trim() : club.club_name;

      // Validasi Club Name
      if (club_name) {
        const existingClubName = await models.ClubDB.findOne({
          club_name: { $regex: new RegExp(clubNameTrim, "i") },
          $or: [
            { deleted_time: { $exists: false } },
            { deleted_by: { $exists: false } },
          ],
          _id: { $ne: club._id },
        });

        if (existingClubName) {
          return response.error(
            400,
            `A Club Name: '${clubNameTrim}' already exists`,
            res
          );
        }

        club.club_name = clubNameTrim;
      }

      // Update img_club
      if (req.file && club.img_clubPublic) {
        try {
          await cloudinary.uploader.destroy(club.img_clubPublic);
        } catch (deleteError) {
          console.error(
            "Error deleting existing image from Cloudinary:",
            deleteError
          );
        }
      }

      if (req.file) {
        try {
          const file = formatImage(req.file);

          const result = await cloudinary.uploader.upload(file, {
            folder: "BOLA",
          });
          club.img_club = result.secure_url;
          club.img_clubPublic = result.public_id;
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          return response.error(
            500,
            "Error uploading image to Cloudinary",
            res
          );
        }
      }

      if (kota) {
        club.kota = kota;
      }

      if (stadium) {
        club.stadium = stadium;
      }

      club.updated_at = defaultDate();

      const options = { session };
      await models.ClubDB(club).save(options);
      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  // View All User
  get: async function (req, res) {
    const {
      created_at_start,
      created_at_end,
      search,
      page = 1,
      limit = 10,
      sort = "Recently",
    } = req.query;

    try {
      const queryObject = {
        deleted_at: { $exists: false },
        deleted_by: { $exists: false },
      };

      if (created_at_start) {
        queryObject.created_at = {
          $gte: moment(created_at_start).startOf("day").valueOf(),
        };
      }

      if (created_at_end) {
        queryObject.created_at = {
          ...queryObject.created_at,
          $lte: moment(created_at_end).endOf("day").valueOf(),
        };
      }

      if (search) {
        // Use the slug directly for searching
        queryObject.slug = search;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      let sortOption = {};
      if (sort === "Recently") {
        sortOption = { created_at: -1 };
      } else if (sort === "Oldest") {
        sortOption = { created_at: 1 };
      } else {
        sortOption = { created_at: -1 };
      }

      const clubsData = await models.ClubDB.find(queryObject)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

      const totalClubs = await models.ClubDB.countDocuments(queryObject);

      const clubsWithFormattedDates = clubsData.map((club) => {
        return {
          ...club.toObject(),
          created_at: moment(club.created_at)
            .tz("Asia/Jakarta")
            .format("DD-MM-YYYY HH:mm:ss"),
          updated_at: club.updated_at
            ? moment(club.updated_at)
                .tz("Asia/Jakarta")
                .format("DD-MM-YYYY HH:mm:ss")
            : null,
        };
      });

      res.status(StatusCodes.OK).json({
        clubs: clubsWithFormattedDates,
        currentPage: page,
        totalClubs,
        numOfPages: Math.ceil(totalClubs / parseInt(limit)),
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to fetch clubs",
      });
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      // Find the club
      const club = await models.ClubDB.findOne({
        _id: id,
        deleted_by: { $exists: false },
        deleted_at: { $exists: false },
      });

      if (!club) {
        return response.error(404, "Club not found", res);
      }

      // Convert timestamps to local time
      const convertedClub = {
        ...club.toObject(),
        created_at: moment
          .tz(club.created_at, "Asia/Jakarta")
          .format("DD-MM-YYYY HH:mm:ss"),
        updated_at: updated_at
          ? moment
              .tz(user.updated_at, "Asia/Jakarta")
              .format("DD-MM-YYYY HH:mm:ss")
          : null,
      };

      return response.ok(convertedClub, res, "Successfully Retrieved Club");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  delete: async function (req, res) {
    const { club_id } = req.body;
    const filter = {
      _id: club_id,
      deleted_at: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const club = await models.ClubDB.findOne(filter);
    if (!club) {
      return response.error(400, "Club not found", res);
    }

    const session = await models.ClubDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      await models.ClubDB.findByIdAndUpdate(
        club_id,
        { deleted_at: defaultDate(), deleted_by: req.user._id },
        options
      );

      await session.commitTransaction();
      session.endSession();

      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },
};

export default ClubController;
