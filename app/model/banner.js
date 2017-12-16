module.exports = (app) => {
  const {
    UUID,
    UUIDV1,
  } = app.Sequelize;

    /**
     * banner
     *
     * @model Banner
     * @namespace Model
     * @property {uuid}   id
     * @property {uuid}   cover_id - 视频封面图
     * @property {uuid}   video_id - 视频内容
     */
  const Banner = app.model.define('banner', {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    cover_id: {
      type: UUID,
      allowNull: false,
    },
    video_id: {
      type: UUID,
      allowNull: false,
    },
  });

  return Banner;
};

