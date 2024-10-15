import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export interface UserInfoView extends LoadingView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends LoadingPresenter<UserInfoView> {
  private followService = new FollowService();

  public switchToLoggedInUser(
    event: React.MouseEvent,
    currentUser: User
  ): void {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser!);
  }

  async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  }

  async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  async toggleFollowStatus(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
    isCurrentlyFollower: boolean
  ) {
    const infoMessageDescription = isCurrentlyFollower
      ? "Unfollowing"
      : "Following";
    const operation = isCurrentlyFollower
      ? this.followService.unfollow
      : this.followService.follow;
    const operationDescription = isCurrentlyFollower
      ? "unfollow user"
      : "follow user";

    event.preventDefault();

    this.doFailureReportingLoadingOperation(
      async () => {
        const [followerCount, followeeCount] = await operation(
          authToken!,
          displayedUser!
        );

        this.view.setIsFollower(!isCurrentlyFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      `${infoMessageDescription} ${displayedUser!.name}...`,
      operationDescription
    );
  }

  async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.toggleFollowStatus(event, authToken, displayedUser, false);
  }

  async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.toggleFollowStatus(event, authToken, displayedUser, true);
  }
}
