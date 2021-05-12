export const Defines = {
    server: function getServer()
    {
        // deployment on uni tomcat server
        if (window.location.host.includes("basecamp-demos"))
        {
            return window.location.origin + "/server/";
        }

        // return "http://localhost:8080/";
        return window.location.protocol + "//" + window.location.hostname + ":8080/";
    },
};

export default Defines;