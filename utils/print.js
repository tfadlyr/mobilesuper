import moment from "moment";

export function getWatermarkHTML(profile, dataPrint, htmldoc) {
  let reference = "";
  dataPrint.references.map(
    (data) =>
      (reference =
        reference +
        `<span style="display: block;font-size: 10pt;">
                              ${data.subject}
                          </span>`)
  );
  const references =
    dataPrint.references.length != 0
      ? `<div style="margin-left: 1.8cm; margin-top:-30px; margin-bottom:20px;">
  <strong style="font-size: 10pt;"><u>References</u></strong>
  ${reference} 
</div>`
      : "";
  let attachment = "";
  dataPrint.attachments.map(
    (data) =>
      (attachment =
        attachment +
        `<span style="display: block;font-size: 10pt;">
                              ${data.name} - ${data.size}
                          </span>`)
  );
  const attachments =
    dataPrint.attachments.length != 0
      ? `<div style="margin-left: 1.8cm; margin-bottom:30px;">
  <strong style="font-size: 10pt;"><u>Attachments</u></strong>
  ${attachment}
</div>
`
      : "";
  let html =
    profile != null &&
    `<style>ol{list-style-type: decimal;} ol ol{list-style-type: lower-alpha;} ol ol ol{list-style-type: lower-roman;}</style>
      <table style="border:none;">
      <thead>
        <tr>
            <td style="font-size:8pt;width:20%">${moment(new Date()).format(
              "M/D/YY, h:mm A"
            )}</td>
            <td style="font-size:8pt;width:80%;text-align:center;">${dataPrint.subject.slice(
              0,
              100
            )}${dataPrint.subject.length > 100 ? "..." : ""}</td>
        </tr>
      </thead>
      <tbody>
          <tr>
              <td>
                  <p
                      style="font-size: 120px; position: fixed; margin-top: 50%; margin-left: 23%; transform: rotate(-40deg); z-index: 0; opacity: 0.2;">
                      ${profile.nik}</p>
              </td>
          </tr>
          <tr>
              <td colspan="2">
                  <section>${htmldoc}</section>
                  ${references}
                  ${attachments}
                  <div style="margin-left: 1.8cm; margin-right: 2cm;">
                      <h6 style="margin-bottom: 0px;">Printed by : ${
                        profile.fullname
                      }</h6>
                      <p style="font-size: 10px; margin-top: 0px;">
                          Dokumen ini dan informasi yang terkandung di dalamnya hanya dipergunakan untuk kepentingan internal TELKOM. Setiap perbuatan atau tindakan,
                          apapun cara dan bentuknya, yang mengakibatkan kandungan informasi tersebut diketahui oleh pihak-pihak yang tidak berhak dapat dikenai sanksi
                          indisipliner dan/atau sanksi hukum.
                      </p>
                  </div>
              </td>
          </tr>
      </tbody>
  </table>
`;
  return html;
}
