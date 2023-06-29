const db = require("../models");
const { Op } = require("sequelize");

const createStep = (body) =>
    new Promise(async (resolve, reject) => {
        try {
            const transaction = await db.sequelize.transaction();
            let step;
            let count = 0;
            for (const stepData of body.step) {
                const { images, ...stepAttributes } = stepData;
                count += 1;

                step = await db.Guild_step.findOrCreate({
                  where: stepAttributes,
                  defaults: {
                    ...stepAttributes,
                    step: count,
                  },
                  transaction,
                });
                
                const imageObjects = images.map(({image}) => ({
                  image,
                  step_id: step[0].step_id,
                }));
              
                await db.Image.bulkCreate(imageObjects, { transaction });
              }
              await transaction.commit();
              
            resolve({
                msg: step[1] ? "Create new step successfully" : "Cannot create new step/Step has already exist"
            });

            redisClient.keys('*foods_*', (error, keys) => {
                if (error) {
                    console.error('Error retrieving keys:', error);
                    return;
                }
                // Delete each key individually
                keys.forEach((key) => {
                    redisClient.del(key, (deleteError, reply) => {
                        if (deleteError) {
                            console.error(`Error deleting key ${key}:`, deleteError);
                        } else {
                            console.log(`Key ${key} deleted successfully`);
                        }
                    });
                });
            });

        } catch (error) {
            reject(error);
        }
    });

const updateStep = ({ images, step_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const step = await db.Guild_step.findOne({
                where: {
                    implementation_guide: body?.implementation_guide,
                    step_id: {
                        [Op.ne]: step_id
                    }
                }
            })

            if (step !== null) {
                resolve({
                    msg: "Step name already exists"
                });
            } else {
                const steps = await db.Guild_step.update(body, {
                    where: { step_id },
                });

                await db.Image.destroy({
                    where: {
                        step_id: step_id,
                    }
                });

                const createImagePromises = images.map(async ({image}) => {
                    await db.Image.create({
                        image: image,
                        step_id: step_id,
                    });
                });

                await Promise.all(createImagePromises);

                resolve({
                    msg:
                        steps[0] > 0
                            ? `${steps[0]} step update`
                            : "Cannot update step/ step_id not found",
                });
            }
        } catch (error) {
            reject(error.message);
        }
    });


const deleteStep = (step_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const steps = await db.Guild_step.update(
                { status: "Deactive" },
                {
                    where: { step_id: step_ids },
                }
            );
            resolve({
                msg:
                    steps > 0
                        ? `${steps} step delete`
                        : "Cannot delete step/ step_id not found",
            });

        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateStep,
    deleteStep,
    createStep,

};