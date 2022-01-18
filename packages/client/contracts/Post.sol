// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Post {
    string public constant name = "Post";

    struct PostData {
        address from;
        uint date;
        string postUrl;
        string postType;
    }

    PostData[] public posts;

    event PostAdded(PostData data);

    function getPosts(uint results, uint lastPage) public view returns(PostData[] memory) {
        if (lastPage == (posts.length - 1)) {
            PostData[] memory p = new PostData[](0);
            return p;
        } else {    
            PostData[] memory p = new PostData[](results);
            for (uint256 i = lastPage; i < posts.length; i++) {
                p[i] = posts[i];
            }
            return p;
        }
    }
    
    function savePost(PostData memory post) public returns(uint){
        require(post.from == msg.sender, "user address invalid");
        post.date = block.timestamp;
        posts.push(post);
        // bool res = posts[posts.length - 1].from == msg.sender;
        emit PostAdded(post);
        return posts.length;
    }

    function getCount() public view returns(uint count) {
        return posts.length;
    }
}