function summaryTemplate() {
    return `<div class="summaryContent">
      <div>
        <div class="summaryHeader">
          <h1>Join 360</h1>
          <div class="verticalLineBlue"></div>
          <p>Key Metrics at a Glance</p>
        </div>
      </div>

      <div class="splitSections">
        <section class="leftSection">
          <div class="topRowDFlex">
            <button>
              <div class="summaryFields">
                <div class="bgCirclesGrey">
                  <svg class="fieldImgs" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path
                      d="M3.16667 22.3332H5.03333L16.5333 10.8332L14.6667 8.9665L3.16667 20.4665V22.3332ZM22.2333 8.89984L16.5667 3.29984L18.4333 1.43317C18.9444 0.922059 19.5722 0.666504 20.3167 0.666504C21.0611 0.666504 21.6889 0.922059 22.2 1.43317L24.0667 3.29984C24.5778 3.81095 24.8444 4.42761 24.8667 5.14984C24.8889 5.87206 24.6444 6.48873 24.1333 6.99984L22.2333 8.89984ZM20.3 10.8665L6.16667 24.9998H0.5V19.3332L14.6333 5.19984L20.3 10.8665Z" />
                  </svg>
                </div>
                <div>
                  <h1 id="toDoNumber">1</h1>
                  <p>To-Do</p>
                </div>
              </div>
            </button>
            <button>
              <div class="summaryFields">
                <div class="bgCirclesGrey">
                  <svg class="fieldImgs" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                    fill="none">
                    <mask id="mask0_314602_5159" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                      width="24" height="25">
                      <rect y="0.5" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_314602_5159)">
                      <path
                        d="M9.55057 15.65L18.0256 7.175C18.2256 6.975 18.4631 6.875 18.7381 6.875C19.0131 6.875 19.2506 6.975 19.4506 7.175C19.6506 7.375 19.7506 7.6125 19.7506 7.8875C19.7506 8.1625 19.6506 8.4 19.4506 8.6L10.2506 17.8C10.0506 18 9.81724 18.1 9.55057 18.1C9.28391 18.1 9.05057 18 8.85057 17.8L4.55057 13.5C4.35057 13.3 4.25474 13.0625 4.26307 12.7875C4.27141 12.5125 4.37557 12.275 4.57557 12.075C4.77557 11.875 5.01307 11.775 5.28807 11.775C5.56307 11.775 5.80057 11.875 6.00057 12.075L9.55057 15.65Z" />
                    </g>
                  </svg>
                </div>
                <div>
                  <h1 id="doneNumber">1</h1>
                  <p>Done</p>
                </div>
              </div>
            </button>
          </div>


          <div>
            <button class="w100">
              <div class="middleField">
                <div class="middleFieldContent">
                  <div class="bgCirclesRed">
                    <img class="fieldImgs" src="../assets/icons/Capa 2.svg" alt="Prio alta">
                  </div>
                  <div>
                    <h1 id="urgentNumber">1</h1>
                    <span>Urgent</span>
                  </div>
                </div>
                <div class="verticalLineGrey"></div>
                <div class="dateSection">
                  <p id="date">Date</p>
                  <span>Upcoming Deadline</span>
                </div>
              </div>
            </button>
          </div>

          <div class="bottomFields">
            <button>
              <div class="summaryFields">
                <div>
                  <h1 id="amountTasksNumber">1</h1>
                  <p>Tasks in Board</p>
                </div>
              </div>
            </button>
            <button>
              <div class="summaryFields">
                <div>
                  <h1 id="progressNumber">1</h1>
                  <p>Tasks in Progress</p>
                </div>
              </div>
            </button>
            <button>
              <div class="summaryFields">
                <div>
                  <h1 id="awaitFeedbackNumber">1</h1>
                  <p>Awaiting Feedback</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section class="rightSection">
          <h2>Good morning</h2>
        </section>
      </div>
    </div>`;
}



