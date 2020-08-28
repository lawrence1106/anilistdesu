import React from "react";
import { Helmet } from "react-helmet";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Typography, Divider, withStyles, Button } from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import MUIDatatables from "mui-datatables";
import "../Fonts/Bangers-Regular.ttf";
import Axios from "axios";
import droppedListLogo from "../Images/droppedListLogo.png";
import redeemLogo from "../Images/redeem.png";
import deleteLogo from "../Images/delete.png";
import success from "../Images/success.png";
import closeLogo from "../Images/close.png";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const getListUrl = "http://localhost:3001/getList";
const getAnimeUrl = "http://localhost:3001/getAnime";
const deleteAnimeUrl = "http://localhost:3001/deleteAnime";

const styles = {
  listHeader: {
    display: "flex",
    alignItems: "center",
  },
  font: {
    fontFamily: "Bangers",
  },
  appbarIcons: {
    height: "10vh",
    margin: "5px",
  },
  titleDivider: {
    fontFamily: "Bangers",
    margin: "7.5px",
  },
  actionsContainer: {
    marginTop: "7.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  itemsHolder: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSize: {
    height: "20vh",
    cursor: "pointer",
  },
};
const options = {
  filterType: "checkbox",
  selectableRowsHideCheckboxes: true,
  selectableRowsHeader: false,
  print: false,
  download: false,
  viewColumns: false,
  filter: false,
};

class DroppedAnime extends React.Component {
  state = {
    droppedList: [],
  };
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);

    const { cookies } = props;
    this.state = {
      sessionName: cookies.get(["sessionName"]),
    };
  }

  componentDidMount() {
    Axios.post(getListUrl, {
      sessionName: this.state.sessionName,
      listType: "droppedList",
    }).then((res) => {
      this.setState({ droppedList: res.data });
    });
  }

  render() {
    const { classes } = this.props;

    const reloadTable = () => {
      Axios.post(getListUrl, {
        sessionName: this.state.sessionName,
        listType: "droppedList",
      }).then((res) => {
        this.setState({ droppedList: res.data });
      });
    };

    const successPromt = () => {
      MySwal.fire({
        html: (
          <div className={classes.actionsContainer}>
            <div className={classes.itemsHolder}>
              <Typography variant="h4" className={classes.font}>
                Anime
              </Typography>
              <Typography className={classes.font}>Updated!</Typography>
              <img
                className={classes.logoSize}
                src={success}
                alt="Success! Logo"
              />
            </div>
          </div>
        ),
        onClose: () => {
          reloadTable();
        },
        showCloseButton: true,
        showConfirmButton: false,
        closeButtonHtml:
          "<img alt='close logo' src=" +
          closeLogo +
          " style='height: 35px;' />",
      });
    };

    const errorPrompt = () => {
      MySwal.fire({
        icon: "warning",
        html: (
          <div>
            <Typography variant="h3" className={classes.font}>
              Oops! Something went wrong!
            </Typography>
            <Typography className={classes.font}>
              Please contact admin for more details in this email:
              sampleEmail@email.com
            </Typography>
          </div>
        ),
      });
    };

    const deleteAnime = (deleteId) => {
      MySwal.fire({
        icon: "warning",
        html: (
          <Typography variant="h3" className={classes.font}>
            Are you sure?
          </Typography>
        ),
        confirmButtonText: "('-'*ゞ",
        showCloseButton: true,
        closeButtonHtml:
          "<img alt='close logo' src=" +
          closeLogo +
          " style='height: 35px;' />",
        preConfirm: () => {
          Axios.post(deleteAnimeUrl, {
            aniId: deleteId,
            user: this.state.sessionName,
          }).then((res) => {
            if (res.data.result === true) {
              MySwal.fire({
                icon: "success",
                html: (
                  <Typography variant="h3" className={classes.font}>
                    Anime Deleted!
                  </Typography>
                ),
                showConfirmButton: false,
                showCloseButton: true,
                closeButtonHtml:
                  "<img alt='close logo' src=" +
                  closeLogo +
                  " style='height: 35px;' />",
                onClose: () => {
                  reloadTable();
                },
              });
            } else {
              errorPrompt();
            }
          });
        },
      });
    };

    const redeemAnime = (aniId) => {
      Axios.post(getAnimeUrl, {
        aniId: aniId,
        action: "Unwatched",
        user: this.state.sessionName,
      }).then((res) => {
        if (res.data.results === true) {
          successPromt();
        }
      });
    };
    const actions = (event) => {
      let aniId = event.currentTarget.value;

      Axios.post(getAnimeUrl, {
        user: this.state.sessionName,
        action: "getAniDetails",
        aniId: aniId,
      }).then((res) => {
        MySwal.fire({
          html: (
            <div>
              <Typography variant="h5" className={classes.titleDivider}>
                {res.data.title}
              </Typography>
              <Typography variant="h6" className={classes.font}>
                ({res.data.status})
              </Typography>
              <Divider></Divider>
              <div className={classes.actionsContainer}>
                <div className={classes.itemsHolder}>
                  <Typography variant="h4" className={classes.font}>
                    delete
                  </Typography>
                  <img
                    onClick={() => {
                      deleteAnime(aniId);
                    }}
                    src={deleteLogo}
                    alt="delete logo"
                    className={classes.logoSize}
                  />
                </div>
                <div className={classes.itemsHolder}>
                  <Typography variant="h4" className={classes.font}>
                    Redeem
                  </Typography>
                  <img
                    alt="redeemAnime Logo"
                    onClick={() => {
                      redeemAnime(aniId);
                    }}
                    src={redeemLogo}
                    className={classes.logoSize}
                  />
                </div>
              </div>
            </div>
          ),
          showCloseButton: true,
          showConfirmButton: false,
          closeButtonHtml:
            "<img alt='close logo' src=" +
            closeLogo +
            " style='height: 35px;' />",
        });
      });
    };

    const columns = [
      {
        key: "pending",
        name: "ani_name",
        label: "Anime",
        options: {
          filter: false,
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Anime
              </Typography>
            );
          },
        },
      },
      {
        name: "ani_status",
        label: "Progress",
        options: {
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Status
              </Typography>
            );
          },
        },
      },
      {
        name: "ani_id",
        label: "Actions",
        options: {
          customBodyRender: (value) => {
            console.log();
            return (
              <Button
                value={value}
                variant="contained"
                color="primary"
                onClick={actions}
              >
                <Settings />
              </Button>
            );
          },
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Actions
              </Typography>
            );
          },
          filter: false,
        },
      },
    ];
    return (
      <div>
        <Helmet>
          <title>Anilist Desu! - Dropped List</title>
        </Helmet>
        <MUIDatatables
          title={[
            <div key="MUIDatatables">
              <div className={classes.listHeader}>
                <img
                  src={droppedListLogo}
                  alt="List Icon"
                  className={classes.appbarIcons}
                />
                <Typography className={classes.font} variant="h3">
                  Dropped Anime
                </Typography>
              </div>
              <Divider />
            </div>,
          ]}
          options={options}
          columns={columns}
          data={this.state.droppedList}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withCookies(DroppedAnime));
