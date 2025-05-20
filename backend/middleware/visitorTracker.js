import { Visitor } from '../models/Visitor.js';
import { v4 as uuidv4 } from 'uuid';

export const trackVisitor = async (req, res, next) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    console.log('IP Address:', ipAddress);

    let visitorUuid;
    if (req.cookies) {
    visitorUuid = req.cookies.visitorUuid;
    } else {
    visitorUuid = null;
    }

    if (!visitorUuid) {
      // Generate a new UUID and set it as a cookie
      visitorUuid = uuidv4();
      res.cookie('visitorUuid', visitorUuid, { maxAge: 31536000000, httpOnly: true });

      console.log('Creating new visitor with UUID:', visitorUuid, 'IP Address:', ipAddress);
      // Create a new visitor entry
      await Visitor.create({
        Visitor_UUID: visitorUuid,
        IP_Address: ipAddress,
        Is_Returning_Visitor: false,
      });
    } else {
      // Check if visitor exists in the database
      let visitor = await Visitor.findOne({ where: { visitor_uuid: visitorUuid } });

      if (visitor) {
        // Visitor exists, update if necessary
        if (!visitor.isReturningVisitor) {
          visitor.isReturningVisitor = true;
          await visitor.save();
        }
      } else {
        console.log('Creating new visitor with UUID:', visitorUuid, 'IP Address:', ipAddress);


        // Visitor UUID not found in database, create new entry
        await Visitor.create({
          Visitor_UUID: visitorUuid,
          IP_Address: ipAddress,
          Is_Returning_Visitor: false,
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error tracking visitor:', error);
    next();
  }
};