module.exports = {
  activationTemplate: (url, token) => {
    return `
        <!doctype html>
        <html>

        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Simple Transactional Email</title>
            <style>
                body {
                    background-color: #f6f6f6;
                    font-family: sans-serif;
                    -webkit-font-smoothing: antialiased;
                    font-size: 14px;
                    line-height: 1.4;
                    margin: 0;
                    padding: 0;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }

                table {
                    border-collapse: separate;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    width: 100%;
                }

                table td {
                    font-family: sans-serif;
                    font-size: 14px;
                    vertical-align: top;
                }

                /* -------------------------------------
                BODY & CONTAINER
            ------------------------------------- */
                .body {
                    background-color: #f6f6f6;
                    width: 100%;
                }

                .container {
                    display: block;
                    Margin: 0 auto !important;
                    /* makes it centered */
                    max-width: 580px;
                    padding: 10px;
                    width: 580px;
                }

                .content {
                    box-sizing: border-box;
                    display: block;
                    Margin: 0 auto;
                    max-width: 580px;
                    padding: 10px;
                }

                /* -------------------------------------
                HEADER, FOOTER, MAIN
            ------------------------------------- */
                .main {
                    background: #fff;
                    border-radius: 3px;
                    width: 100%;
                }

                .wrapper {
                    box-sizing: border-box;
                    padding: 20px;
                }

                h1,
                h2,
                h3,
                h4 {
                    color: #000000;
                    font-family: sans-serif;
                    font-weight: 400;
                    line-height: 1.4;
                    margin: 0;
                    Margin-bottom: 30px;
                }

                h1 {
                    font-size: 35px;
                    font-weight: 300;
                    text-align: center;
                    text-transform: capitalize;
                }

                p,
                ul,
                ol {
                    font-family: sans-serif;
                    font-size: 14px;
                    font-weight: normal;
                    margin: 0;
                    Margin-bottom: 15px;
                }

                p li,
                ul li,
                ol li {
                    list-style-position: inside;
                    margin-left: 5px;
                }

                a {
                    color: #3498db;
                    text-decoration: underline;
                }

                /* -------------------------------------
                BUTTONS
            ------------------------------------- */
                .btn {
                    box-sizing: border-box;
                    width: 100%;
                }

                .btn>tbody>tr>td {
                    padding-bottom: 15px;
                }

                .btn table {
                    width: auto;
                }

                .btn table td {
                    background-color: #ffffff;
                    border-radius: 5px;
                    text-align: center;
                }

                .btn a {
                    background-color: #ffffff;
                    border: solid 1px #3498db;
                    border-radius: 5px;
                    box-sizing: border-box;
                    color: #3498db;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: bold;
                    margin: 0;
                    padding: 12px 25px;
                    text-decoration: none;
                    text-transform: capitalize;
                }

                .btn-primary table td {
                    background-color: #3498db;
                }

                .btn-primary a {
                    background-color: #3498db;
                    border-color: #3498db;
                    color: #ffffff;
                }
            </style>
        </head>

        <body class="">
            <table border="0" cellpadding="0" cellspacing="0" class="body">
                <tr>
                    <td>&nbsp;</td>
                    <td class="container">
                        <div class="content">
                            <table class="main">

                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                    <td class="wrapper">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <h1>Confirm your email</h1>
                                                    <h3>You are just one step away. This link is one time accessible and valid for 24 hours only.</h3>
                                                    <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left">
                                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td> <a href="${url}auth/activate/${token}"
                                                                                        target="_blank">confirm email</a> </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <p>If above link does not work, then paste this url in browser <a href="${url}auth/activate/${token}"
                                                                                        target="_blank">${url}auth/activate/${token}</a></p>
                                                    <h2>See you there 😊😊</h2>

                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- END MAIN CONTENT AREA -->
                            </table>

                            <!-- END CENTERED WHITE CONTAINER -->
                        </div>
                    </td>
                    <td>&nbsp;</td>
                </tr>
            </table>
        </body>
        </html>
        `;
  },
};
