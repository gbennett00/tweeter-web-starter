import {
  anyNumber,
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const user = new User("first", "last", "alias", "url");
  let mouseEvent: React.MouseEvent;

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock(StatusService);
    const mockStatusServiceInstance = instance(mockStatusService);
    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );

    mouseEvent = instance(mock<React.MouseEvent>());
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(
      mouseEvent,
      "Hello, world!",
      authToken,
      user
    );

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(
      mouseEvent,
      "Hello, world!",
      authToken,
      user
    );

    verify(mockStatusService.postStatus(authToken, anything())).once();

    let [, capturedStatus] = capture(mockStatusService.postStatus).last();
    expect(capturedStatus.post).toEqual("Hello, world!");
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message when post status success", async () => {
    await postStatusPresenter.submitPost(
      mouseEvent,
      "Hello, world!",
      authToken,
      user
    );

    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when post status failure", async () => {
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(new Error("Failed to post status"));
    
    await postStatusPresenter.submitPost(mouseEvent, "Hello, world!", authToken, user);

    verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: Failed to post status")).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
