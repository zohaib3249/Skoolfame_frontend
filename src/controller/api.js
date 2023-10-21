import axios from "axios";
const COMMON_ERROR = "Error, Please try again.!";
const errorResponse = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 403) {
      setTimeout(() => {
        window.location.href = "/";
        localStorage.clear();
      }, 5000);
    }
    return data;
  } else {
    return { status: 0, message: COMMON_ERROR };
  }
};

//LOGIN

export const login = async (requestData) => {
  try {
    const { email, password } = requestData;
    const login = await axios.post("/sign-in", { email, password });
    const { data } = login;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// USER

export const getAllUser = async (perPage, page = 1, searchData, rev) => {
  try {
    const AllUser = await axios.get(`/all-user?perPage=${perPage}&page=${page}&search=${searchData}&ascending=${rev}`);
    const { data } = AllUser;
    console.log("");
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

export const singleUserDetail = async (id) => {
  try {
    const userDetail = await axios.get(`/get-user-by-id?id=${id}`);
    const { data } = userDetail;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// All SCHOOL

export const getAllSchool = async (perPage, page = 1, searchData, rev) => {
  try {
    const AllSchool = await axios.get(`/get-all-school?perPage=${perPage}&page=${page}&search=${searchData}&ascending=${rev}`);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
//All reports
export const getAllReports = async (perPage, page = 1) => {
  try {
    const AllReport = await axios.get(`/get-report-post?perPage=${perPage}&page=${page}`);
    const { data } = AllReport;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
}

// Add All Superlatives

export const addSuperlatives = async (name) => {
  try {
    // console.log(name,"=========Name==========");
    // return
    const AllSchool = await axios.post(`/add-all-superlative`, { name });
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// All SCHOOL for user request

export const getAllSchoolsRequest = async (perPage, page = 1, searchData) => {
  try {
    const AllSchool = await axios.get(`/get-school`);
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

//  SCHOOL

export const getSchool = async (perPage, page = 1, searchData, id, rev) => {
  try {
    const AllSchool = await axios.get(
      `/get-all-superlative?perPage=${perPage}&page=${page}&id=${id}&search=${searchData}&ascending=${rev}`
    );
    const { data } = AllSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

export const createSchool = async (fileData, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('name', fileData.name);
    formData.append('address', fileData.address);
    formData.append('state', fileData.state);
    formData.append('since', fileData.since);
    formData.append('about', fileData.about);
    // return
    const CreateSchool = await axios.post(`/add-school`, formData);
    const { data } = CreateSchool;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
}

//ABOUT

export const updateAbout = async (about) => {
  try {
    const aboutDetail = await axios.post(`/about-us`, { message: about });
    const { data } = aboutDetail;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

//album

export const getAlbum = async (type, id) => {
  try {
    const album = await axios.post(`/get-all-document?id=${id}`, { type });
    const { data } = album;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// user's list for chat

export const getChatuser = async (id) => {
  try {
    const user = await axios.get(`/get-user-chat?id=${id}`);
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

// user chat
export const getChatById = async (sid, rid) => {
  try {
    const user = await axios.post("/user-chat", {
      sender_id: sid,
      receiver_id: rid,
    });
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};

//school Nominees

export const schoolNominees = async (id) => {
  try {
    const user = await axios.get(`/get-nominees?id=${id}`);
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
//get All Liv eUser

export const getAllLiveUser = async (id) => {
  try {
    const user = await axios.get("/dashboard");
    const { data } = user;
    return data;
  } catch (error) {
    return errorResponse(error);
  }
};
