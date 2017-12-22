module.exports = (app) => {
  const {
    UUID,
    UUIDV1,
    STRING,
    INTEGER,
    ENUM,
    ARRAY,
  } = app.Sequelize;

  /**
   * 贺卡Model
   *
   * @model Card
   * @namespace Model
   *
   * @property {uuid}    id
   * @property {number}  no              - 贺卡序列号
   * @property {uuid}    voice_id        - 贺卡录音id
   * @property {uuid}    video_id        - 贺卡视频id
   * @property {uuid}    cover_id        - 贺卡视频封面id
   * @property {uuid}    blessing        - 祝福语
   * @property {uuid}    background_id   - 背景图 id
   * @property {array}   picture_ids     - 照片ids
   * @property {uuid}    user_id         - 商家id
   * @property {string}  union_id        - 顾客的唯一身份认证
   * @property {number}  click           - 点击数量
   * @property {uuid}    category_id     - 贺卡分类
   * @property {string}  status          - 贺卡状态['NONBLANK','BLANK']分别表示贺卡为空或者非空
   */
  const Card = app.model.define('card', {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    no: {
      type: INTEGER,
      autoIncrement: true,
    },
    voice_id: {
      type: UUID,
      allowNull: true,
    },
    video_id: {
      type: UUID,
      allowNull: true,
    },
    cover_id: {
      type: UUID,
      allowNull: true,
    },
    blessing: {
      type: STRING,
      allowNull: true,
    },
    picture_ids: {
      type: ARRAY(UUID),
      allowNull: false,
      defaultValue: [],
    },
    background_id: {
      type: UUID,
      allowNull: true,
    },
    user_id: {
      type: UUID,
      allowNull: false,
    },
    category_id: {
      type: UUID,
      allowNull: false,
    },
    union_id: {
      type: STRING(32),
    },
    click: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: ENUM,
      values: [
        'NONBLANK',
        'BLANK',
      ],
      defaultValue: 'BLANK',
      allowNull: false,
    },
  });
  return Card;
};

