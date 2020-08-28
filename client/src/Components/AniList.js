import React from "react";
import { Helmet } from "react-helmet";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import {
  Button,
  Typography,
  withStyles,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import MUIDatatable from "mui-datatables";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Settings, FavoriteBorder, Favorite } from "@material-ui/icons";
import "../Fonts/Bangers-Regular.ttf";
import closeLogo from "../Images/close.png";
import Watched from "../Images/Watched.png";
import Unwatched from "../Images/Unwatched.png";
import deleteLogo from "../Images/delete.png";
import success from "../Images/success.png";
import listIcon from "../Images/listIcon.png";
import formLogo from "../Images/addAnime.png";
import editLogo from "../Images/edit.png";
import dropLogo from "../Images/drop.png";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-left",
  showConfirmButton: false,
  timer: 1500,
});
const MySwal = withReactContent(Swal);

const getListUrl = "http://localhost:3001/getList";
const addAnimeUrl = "http://localhost:3001/addAnime";
const deleteAnimeUrl = "http://localhost:3001/deleteAnime";
const getAnimeUrl = "http://localhost:3001/getAnime";
const updateAnimeUrl = "http://localhost:3001/updateAnime";

const styles = (theme) => ({
  titleDivider: {
    fontFamily: "Bangers",
    margin: "7.5px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  appbarIcons: {
    height: "10vh",
    margin: "5px",
  },
  listHeader: { display: "flex", alignItems: "center", cursor: "pointer" },
  font: {
    fontFamily: "Bangers",
  },
  options: {
    height: "30vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  logoSize: {
    height: "20vh",
    cursor: "pointer",
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
  formItems: {
    margin: "10px",
  },
  formContainer: {
    height: "25vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  yatoDesu: {
    zIndex: "-1",
    position: "absolute",
    height: "250px",
    left: "0",
    bottom: "0",
  },
});

class AniList extends React.Component {
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

  state = {
    aniList: [],
    aniStatus: "",
    aniDetails: {},
  };

  componentDidMount() {
    Axios.post(getListUrl, {
      sessionName: this.state.sessionName,
      listType: "yourList",
    }).then((res) => {
      let aniList = res.data;
      this.setState({ aniList });
    });
  }

  render() {
    const { classes } = this.props;

    const reloadTable = () => {
      Axios.post(getListUrl, {
        sessionName: this.state.sessionName,
        listType: "yourList",
      }).then((res) => {
        let aniList = res.data;
        this.setState({ aniList });
      });
    };
    const statusSelect = (event) => {
      let aniStatus = event.target.value;
      this.setState({ aniStatus });
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
    const addAnime = () => {
      this.setState({ aniStatus: "" });
      MySwal.fire({
        html: (
          <div>
            <div className={classes.registrationHeader}>
              <img
                className={classes.yatoDesu}
                alt="Yato-desu!"
                src={formLogo}
              />
              <Typography className={classes.font} variant="h3">
                Add Anime
              </Typography>
            </div>
            <Divider />
            <div className={classes.formContainer}>
              <TextField
                autoFocus={true}
                className={classes.formItems}
                label="Title"
                id="title"
                onChange={() => {
                  Swal.resetValidationMessage();
                }}
              ></TextField>
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  name={this.state.aniStatus}
                  id="aniStatus"
                  onChange={statusSelect}
                  onClick={() => {
                    Swal.resetValidationMessage();
                  }}
                  className={classes.formControl}
                >
                  <MenuItem value="Unwatched">Unwatched</MenuItem>
                  <MenuItem value="Watched">Watched</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        ),
        confirmButtonText: "(ง︡'-'︠)ง Ikee!",
        showCloseButton: true,
        closeButtonHtml:
          "<img src=" + closeLogo + " alt='close logo' style='height: 35px' />",
        preConfirm: () => {
          let aniTitle = document.querySelector("#title").value;
          let status = this.state.aniStatus;

          if (aniTitle && status) {
            Axios.post(addAnimeUrl, {
              aniTitle: aniTitle,
              status: status,
              user: this.state.sessionName,
            }).then((res) => {
              if (res.data.result === true) {
                MySwal.fire({
                  icon: "success",
                  html: (
                    <Typography variant="h3" className={classes.font}>
                      Anime Added!
                    </Typography>
                  ),
                  onClose: () => {
                    reloadTable();
                  },
                  confirmButtonText: "(͠≖ ͜ʖ͠≖)👌  Noice!!",
                  showCloseButton: true,
                  closeButtonHtml:
                    "<img alt='close logo' src=" +
                    closeLogo +
                    " style='height: 35px;' />",
                });
              } else {
                errorPrompt();
              }
            });
          } else {
            Swal.showValidationMessage("All fields must be filled");
          }
        },
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

    const dropAnime = (aniId) => {
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
          Axios.post(getAnimeUrl, {
            user: this.state.sessionName,
            action: "dropAnime",
            aniId: aniId,
          }).then((res) => {
            if (res.data.result === true) {
              successPromt();
              reloadTable();
            } else {
              errorPrompt();
            }
          });
        },
      });
    };

    const editAnime = (aniId) => {
      Axios.post(getAnimeUrl, {
        aniId: aniId,
        user: this.state.sessionName,
        action: "getAniDetails",
      }).then((res) => {
        const aniTitle = res.data.title;
        MySwal.fire({
          html: (
            <div>
              <div className={classes.registrationHeader}>
                <img
                  className={classes.yatoDesu}
                  alt="Yato-desu!"
                  src={formLogo}
                />
                <Typography className={classes.font} variant="h3">
                  Edit Anime
                </Typography>
              </div>
              <Divider />
              <div className={classes.formContainer}>
                <Typography variant="h5" className={classes.font}>
                  {aniTitle}
                </Typography>
                <TextField
                  label="New Title"
                  id="aniTitle"
                  autoFocus={true}
                  className={classes.formItems}
                ></TextField>
              </div>
            </div>
          ),
          confirmButtonText: "(ง︡'-'︠)ง Ikee!",
          showCloseButton: true,
          closeButtonHtml:
            "<img alt='close logo' src=" +
            closeLogo +
            " style='height: 35px;' />",
          preConfirm: () => {
            let aniTitle = document.querySelector("#aniTitle").value;
            Axios.post(updateAnimeUrl, {
              aniId: aniId,
              user: this.state.sessionName,
              title: aniTitle,
            }).then((res) => {
              if (res.data.results === true) {
                successPromt();
                reloadTable();
              } else {
                errorPrompt();
              }
            });
          },
        });
      });
    };

    const unwatchedActions = (aniId, title, status) => {
      return (
        <div>
          <Typography variant="h5" className={classes.titleDivider}>
            {title}
          </Typography>
          <Typography variant="h6" className={classes.font}>
            ({status})
          </Typography>
          <Divider></Divider>
          <div className={classes.actionsContainer}>
            <div className={classes.actionSection}>
              <div
                onClick={() => {
                  editAnime(aniId);
                }}
                className={classes.itemsHolder}
              >
                <Typography variant="h4" className={classes.font}>
                  Edit
                </Typography>
                <img
                  src={editLogo}
                  alt="edit logo"
                  className={classes.logoSize}
                />
              </div>
              <div
                onClick={() => {
                  dropAnime(aniId);
                }}
                className={classes.itemsHolder}
              >
                <Typography variant="h4" className={classes.font}>
                  Drop
                </Typography>
                <img
                  src={dropLogo}
                  alt="drop logo"
                  className={classes.logoSize}
                />
              </div>
            </div>
            <div className={classes.actionSection}>
              <div
                onClick={() => {
                  deleteAnime(aniId);
                }}
                className={classes.itemsHolder}
              >
                <Typography variant="h4" className={classes.font}>
                  delete
                </Typography>
                <img
                  src={deleteLogo}
                  alt="delete logo"
                  className={classes.logoSize}
                />
              </div>
              <div className={classes.itemsHolder}>
                <Typography variant="h4" className={classes.font}>
                  Update Status
                </Typography>
                <img
                  onClick={setWatched}
                  alt={aniId}
                  src={Unwatched}
                  className={classes.logoSize}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    const watchedActions = (aniId, title, status) => {
      return (
        <div>
          <Typography variant="h5" className={classes.titleDivider}>
            {title}
          </Typography>
          <Typography variant="h6" className={classes.font}>
            ({status})
          </Typography>
          <Divider></Divider>
          <div className={classes.actionsContainer}>
            <div className={classes.actionSection}>
              <div
                onClick={() => {
                  editAnime(aniId);
                }}
                className={classes.itemsHolder}
              >
                <Typography variant="h4" className={classes.font}>
                  Edit
                </Typography>
                <img
                  src={editLogo}
                  alt="edit logo"
                  className={classes.logoSize}
                />
              </div>
              <div
                onClick={() => {
                  dropAnime(aniId);
                }}
                className={classes.itemsHolder}
              >
                <Typography variant="h4" className={classes.font}>
                  Drop
                </Typography>
                <img
                  src={dropLogo}
                  alt="drop logo"
                  className={classes.logoSize}
                />
              </div>
            </div>
            <div className={classes.actionSection}>
              <div
                onClick={() => {
                  deleteAnime(aniId);
                }}
                className={classes.itemsHolder}
              >
                <Typography variant="h4" className={classes.font}>
                  delete
                </Typography>
                <img
                  src={deleteLogo}
                  alt="delete logo"
                  className={classes.logoSize}
                />
              </div>
              <div className={classes.itemsHolder}>
                <Typography variant="h4" className={classes.font}>
                  Update Status
                </Typography>
                <img
                  src={Watched}
                  onClick={setUnWatched}
                  className={classes.logoSize}
                  alt={aniId}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    const setWatched = (event) => {
      let aniId = event.currentTarget.alt;

      Axios.post(getAnimeUrl, {
        aniId: aniId,
        action: "Watched",
        user: this.state.sessionName,
      }).then((res) => {
        if (res.data.results === true) {
          successPromt();
        }
      });
    };

    const setUnWatched = (event) => {
      let aniId = event.target.alt;
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
        aniId: aniId,
        action: "getAniDetails",
        user: this.state.sessionName,
      }).then((res) => {
        let status = res.data.status;
        let title = res.data.title;

        if (status === "Watched") {
          MySwal.fire({
            html: watchedActions(aniId, title, status),
            showCloseButton: true,
            showConfirmButton: false,
            closeButtonHtml:
              "<img src=" +
              closeLogo +
              " alt='close logo' style='height: 35px;' />",
          });
        }

        if (status === "Unwatched") {
          MySwal.fire({
            html: unwatchedActions(aniId, title, status),
            showCloseButton: true,
            showConfirmButton: false,
            closeButtonHtml:
              "<img alt='close logo' src=" +
              closeLogo +
              " style='height: 35px;' />",
          });
        }
      });
    };
    const options = {
      filterType: "checkbox",
      selectableRowsHideCheckboxes: true,
      selectableRowsHeader: false,
      print: false,
      download: false,
      viewColumns: false,
    };
    const columns = [
      {
        key: this.state.ani_id,
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
        name: "ani_favorites",
        label: "Favorites",
        options: {
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Favorites
              </Typography>
            );
          },
          customBodyRender: (favStatus, meta) => {
            const updFavorites = (aniId, favStatus) => {
              Axios.post(getAnimeUrl, {
                aniId: aniId,
                action: "updFavorites",
                user: this.state.sessionName,
                favStatus: favStatus,
              }).then((res) => {
                if (res.data.results === true) {
                  Toast.fire({
                    icon: "success",
                    title: "Favorites Updated!",
                  });
                  reloadTable();
                } else {
                  errorPrompt();
                }
              });
            };

            if (favStatus === 1) {
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    updFavorites(meta.rowData[3], favStatus);
                  }}
                >
                  <Favorite color="inherit" />
                </Button>
              );
            } else {
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    updFavorites(meta.rowData[3], favStatus);
                  }}
                >
                  <FavoriteBorder color="inherit" />
                </Button>
              );
            }
          },
        },
      },
      {
        name: "ani_id",
        label: "Actions",
        options: {
          customBodyRender: (value) => {
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
          <title>Anilist Desu! - Your List</title>
        </Helmet>
        <MUIDatatable
          title={[
            <div key="MUIDatatables">
              <div onClick={addAnime} className={classes.listHeader}>
                <img
                  src={listIcon}
                  alt="List Icon"
                  className={classes.appbarIcons}
                />
                <Typography variant="h3" className={classes.font}>
                  Add Anime
                </Typography>
              </div>
              <Divider />
            </div>,
          ]}
          columns={columns}
          data={this.state.aniList}
          options={options}
        />
      </div>
    );
  }
}
export default withStyles(styles)(withCookies(AniList));
