def difference(list1,list2):
    new=[]
    for i in range(len(list1)):
        for j in range(len(list2)):
            if list1[i] == list2[j]:
                new.append(list1[i])
    return new

print(difference(["hel","game","girl","boy"],["ho","game","ig","hel"]))